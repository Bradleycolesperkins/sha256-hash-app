import HashForm from "./components/HashForm.tsx";
import HashProgress from "./components/HashProgress.tsx";
import HashDetails from "./components/HashDetails.tsx";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-slate-900 text-white">
        <h1 className="text-3xl font-bold">SHA256 Hash App</h1>

        <div className="flex flex-col gap-4">
          <HashForm />
          <HashProgress />
          <HashDetails />
        </div>
      </div>
    </>
  );
}

export default App;
