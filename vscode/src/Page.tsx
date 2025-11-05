// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
import Box from './components/Box';

// For bundling npm packages: Install them in the plugin directory
// For using host packages: Add them to EXTERNAL_PACKAGES in build.sh
// Example with external package (assumes dayjs is in host):
// const dayjs = require('dayjs');

type PageProps = { data?: any; config?: any };

export default function Page({ data, config }: PageProps) {
  return (
    <div className="w-full h-screen">
      <iframe
        src="http://localhost:8080/?folder=/home/coder/project/velocitas"
        width="100%"
        height="100%"
        frameBorder="0"
      />
    </div>
  );
}
