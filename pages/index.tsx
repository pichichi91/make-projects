import { NextPage } from "next";
import Page from "../components/Page";

const Index: NextPage = () => {
  return (
    <Page title="make-projects" description="A list of potential projects">
      <main className=" mt-16 w-full flex min-h-screen">
        <div>
          <h1 className=" w-full text-center text-6xl font-bold">Projects</h1>
          <div className=" flex justify-center ">
            <h2 className=" max-w-xl text-center text-gray-500 text-xl mt-2 ">
              {" "}
              This is a list of the projects I gathered while going through the
              first chapter of{" "}
              <a
                className=" hover:text-emerald-700 duration-300 transition-all text-emerald-600 border-b border-emerald-700 font-bold "
                href="https://readmake.com"
              >
                readmake.com
              </a>
            </h2>
          </div>
        </div>
      </main>
    </Page>
  );
};

export default Index;
