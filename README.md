# SRT Sub Shifter App

This app is a simple tool that allows you to shift the timecodes of your subtitles to perfectly sync them with your video.

## Features

- **Shift Subtitles**: Adjust subtitle timings based on the desired offset.
- **Error Handling**: Ensures proper format and detects issues like empty files, missing content, or invalid offset formats.

## Installation

### Prerequisites

Before you can run the app, ensure you have the following installed:
- **Node.js**: The app is built using Node.js, so make sure it is installed on your system.
- **pnpm**: Use pnpm for dependency management.

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/JoanRoucoux/sub-shifter-app.git
    cd sub-shifter-app
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. If you'd like to contribute or test the app, you can use the following command to run the app locally:

    ```bash
    pnpm start
    ```

## Usage

1. **Shifting subtitles**:  
   After starting the app, you can use the interface to upload your SRT file and specify the desired offset (in seconds). You can enter positive or negative values to shift the subtitles forward or backward.

2. **Validation**:  
   The app will automatically check if the SRT file contains any issues, such as:
   - Submitting the form with no file or an empty file.
   - A wrong offset format.
   - A file with no subtitles.

3. **Output**:  
   Once the subtitles are shifted successfully, the app will generate a new SRT file which will be dowloaded automatically.

## Troubleshooting

- **Problem**: Subtitles are not properly shifting.
  - **Solution**: Ensure that the offset format you provided is valid and that your SRT file is correctly structured.

- **Problem**: The app is not accepting my SRT file.
  - **Solution**: Double-check that the file is in SRT format and not empty. The app supports SRT files only.

## Images

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and create a pull request. I welcome any improvements, whether it's fixing bugs or adding new features.

### Steps to contribute:
1. Fork the repository.
2. Create a new branch for your feature/fix.
3. Commit your changes.
4. Push to your fork and create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
