import fs from "fs";
import path from "path";
import Dashboard from "./Dashboard";

export default function Home() {
  const pdfsDir = path.resolve(process.cwd(), "src", "app", "RE CHECKED WORD VERISON POLICES");
  let files: string[] = [];

  if (fs.existsSync(pdfsDir)) {
    files = fs.readdirSync(pdfsDir).filter((file) =>
      file.toLowerCase().endsWith(".pdf")
    );
    // Sort files alphabetically for clean presentation
    files.sort((a, b) => a.localeCompare(b));
  }

  return <Dashboard files={files} />;
}
