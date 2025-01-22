import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from './ui/form';
import {
  type FormSchemaType,
  FORM_INPUT_NAMES,
  ACCEPTED_FILE_TYPE,
  FormSchema,
  defaultValues,
  handleFormSubmit,
} from '../config/SRTShifterFormConfig';

const SRTShifterForm = () => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> =>
    await handleFormSubmit(data, form);

  return (
    <>
      <section className="flex-1">
        <h2 className="text-2xl font-semibold mb-4">
          How to sync an SRT file with a video?
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-4">
          Choose the SRT file you want to sync.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-4">
          Enter the offset you want to apply to your subtitles, starting with "+" to add time or "-" to subtract it.
          For example, <strong>+1.20</strong> adds 1 second and 200 milliseconds to each timecode.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-4">
          Click <strong>"Shift SRT Subtitles"</strong> to apply the offset and sync your subtitles.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-4">
          Your resynced file will be automatically downloaded once ready 🍿
        </p>
      </section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 space-y-6 rounded-xl border bg-card text-card-foreground shadow p-6"
        >
          <FormField
            control={form.control}
            name={FORM_INPUT_NAMES.FILE}
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel>
                  Upload SRT File (.srt extension)
                </FormLabel>
                <FormControl>
                  <Input
                    id={FORM_INPUT_NAMES.FILE}
                    type="file"
                    accept={ACCEPTED_FILE_TYPE}
                    onChange={async (event) =>
                      onChange(event.target.files && event.target.files[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={FORM_INPUT_NAMES.OFFSET}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Time Offset
                </FormLabel>
                <FormControl>
                  <Input
                    id={FORM_INPUT_NAMES.OFFSET}
                    type="text"
                    placeholder="+1.20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Shift SRT Subtitles
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SRTShifterForm;
