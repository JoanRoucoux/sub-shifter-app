import { z } from 'zod';
import { UseFormReturn, } from 'react-hook-form';

export const FORM_INPUT_NAMES = {
  FILE: 'file',
  OFFSET: 'offset',
} as const;

const FORM_ERROR_MESSAGES = {
  EMPTY_FILE_CONTENT: 'File content is empty.',
  WRONG_FILE_TYPE: 'Please upload a valid .srt file.',
  WRONG_FILE_SIZE: 'File size must be less than 2MB.',
  EMPTY_OFFSET: 'Offset is required.',
  WRONG_OFFSET_FORMAT: 'Offset must be a number, starting with \'+\' or \'-\'.',
  OFFSET_OUT_OF_RANGE: 'Offset must be between -3600 and +3600 seconds.',
} as const;

export const ACCEPTED_FILE_TYPE = '.srt';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const OFFSET_REGEX = /^[+-][0-9]+\.?[0-9]*$/; // e.g. +1.20
const MAX_OFFSET_SIZE = 3600; // 1 hour in seconds

/**
 * Form schema.
 */
export const FormSchema = z.object({
  [FORM_INPUT_NAMES.FILE]: z
    .instanceof(File)
    .refine((file) => file.name.endsWith(ACCEPTED_FILE_TYPE), {
      message: FORM_ERROR_MESSAGES.WRONG_FILE_TYPE,
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: FORM_ERROR_MESSAGES.WRONG_FILE_SIZE,
    }),
  [FORM_INPUT_NAMES.OFFSET]: z
    .string()
    .min(1, {
      message: FORM_ERROR_MESSAGES.EMPTY_OFFSET,
    })
    .regex(OFFSET_REGEX, {
      message: FORM_ERROR_MESSAGES.WRONG_OFFSET_FORMAT,
    })
    .refine(
      (offset) => {
        const value = parseFloat(offset);
        return (
          !isNaN(value) && value >= -MAX_OFFSET_SIZE && value <= MAX_OFFSET_SIZE
        );
      },
      {
        message: FORM_ERROR_MESSAGES.OFFSET_OUT_OF_RANGE,
      }
    ),
});

/**
 * Form schema type.
 */
export type FormSchemaType = z.infer<typeof FormSchema>;

/**
 * Form default values
 */
export const defaultValues: FormSchemaType = {
  file: new File([], ''),
  offset: '',
};

/**
 * Download the resynced file.
 *
 * @param resyncedContent - The resynced content
 * @param fileName - The original file name
 */
export const downloadResyncedFile = (resyncedContent: string, fileName: string): void => {
  // Create a Blob from the resynced content
  const blob = new Blob([resyncedContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  // Create an anchor element and trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.replace(/\.srt$/, '-resynced.srt');
  link.click();

  // Clean up the object URL
  URL.revokeObjectURL(url);
};

/**
 * Resync the file content based on the specified offset.
 *
 * @param content - The file content
 * @param offset - The offset
 * @returns The resynced timestamps
 */
const resyncTimestamps = (content: string, offset: string): string => {
  // Parse the offset to a number
  const parsedOffset = parseFloat(offset);

  // Process each line of the file
  const lines = content.split('\n');
  const resyncedLines = lines.map((line) => {
    const timecodeMatch = line.match(
      /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/
    );

    // Resync timestamps
    if (timecodeMatch) {
      const [_, startTime, endTime] = timecodeMatch;
      const adjustedStartTime = adjustTimestamp(startTime, parsedOffset);
      const adjustedEndTime = adjustTimestamp(endTime, parsedOffset);
      return `${adjustedStartTime} --> ${adjustedEndTime}`;
    }

    return line;
  });

  // Join the adjusted lines back into a single string
  return resyncedLines.join('\n');
};

/**
 * Adjust a timestamp by a given offset.
 *
 * @param timestamp - The original timestamp in "hh:mm:ss,SSS" format.
 * @param offset - The offset in seconds (positive or negative).
 * @returns The adjusted timestamp.
 */
const adjustTimestamp = (timestamp: string, offset: number): string => {
  const [hours, minutes, seconds] = timestamp.split(':');
  const [secs, millis] = seconds.split(',');

  // Convert the timestamp to milliseconds
  let totalMillis =
    parseInt(hours) * 3600000 +
    parseInt(minutes) * 60000 +
    parseInt(secs) * 1000 +
    parseInt(millis);

  // Apply the offset (convert seconds to milliseconds)
  totalMillis += offset * 1000;

  // Handle negative timestamps by clamping to zero
  if (totalMillis < 0) {
    totalMillis = 0;
  }

  // Convert back to "hh:mm:ss,SSS" format
  const newHours = Math.floor(totalMillis / 3600000);
  const newMinutes = Math.floor((totalMillis % 3600000) / 60000);
  const newSeconds = Math.floor((totalMillis % 60000) / 1000);
  const newMillis = totalMillis % 1000;

  // Return new timestamp
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(
    2,
    '0'
  )}:${String(newSeconds).padStart(2, '0')},${String(newMillis).padStart(
    3,
    '0'
  )}`;
};

/**
 * Handle form submit
 * 
 * @param data form data
 * @param form form hook
 */
export const handleFormSubmit = async (
  data: FormSchemaType,
  form: UseFormReturn<FormSchemaType>
): Promise<void> => {
  const { file, offset } = data;

  // Read the file content
  const reader = new FileReader();
  reader.onload = (event) => {
    // Get the file content
    const fileContent = event?.target?.result as string;
    if (!fileContent) {
      form.setError(FORM_INPUT_NAMES.FILE, {
        type: 'manual',
        message: FORM_ERROR_MESSAGES.EMPTY_FILE_CONTENT,
      });
      return;
    }

    // Resync timestamps
    const resyncedContent = resyncTimestamps(fileContent, offset);

    // Download the resynced file
    downloadResyncedFile(resyncedContent, file.name);
  };

  reader.readAsText(file);
};
