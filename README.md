# SHA256 Hash App

A web application for computing and managing SHA256 hashes of files.

![Application Demo](.github/demo.gif)

## Features

- **File Hashing**: Compute SHA256 hashes for any file type
- **Progress Tracking**: Real-time progress updates during hash computation
- **Web Worker Implementation**: Hash computation runs in a separate thread to prevent UI freezing
- **Hash History**: Keep track of previously computed hashes
- **File Information**: Display file details including name, size, and description
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful error handling with retry options

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Bradleycolesperkins/sha256-hash-app.git
   cd sha256-hash-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload a File**: Click on the upload area to select a file or drag and drop a file
2. **View Hash**: The SHA256 hash will be computed and displayed
3. **Add Description**: Optionally add a description for the file
4. **Save Hash**: Click the "Save" button to add the hash to your history
5. **View History**: Previously computed hashes are displayed in the history table

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Technologies Used

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Web Crypto API**: For SHA256 hash computation
- **Web Workers**: For non-blocking hash computation
- **Vitest**: Testing framework

## Project Structure

- `src/components/`: React components
- `src/utils/`: Utility functions
- `src/workers/`: Web Worker for hash computation
- `src/constants/`: Application constants
- `src/types/`: TypeScript type definitions
