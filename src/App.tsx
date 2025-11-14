import HashForm from "./components/HashForm.tsx";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-slate-900 text-white">
        <h1 className="text-3xl font-bold">SHA256 Hash App</h1>

        <div className="flex flex-col gap-4 w-full items-center justify-center">
          <HashForm />
        </div>
      </div>
    </>
  );
}

export default App;
