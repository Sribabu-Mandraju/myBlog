import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import testMd from "../../../public/mds/test2.md?raw";

const Statemindctf25 = () => {
  return (
    <div className="min-h-screen bg-[#151518] py-8 px-2 sm:px-4 md:px-8 flex justify-center">
      <div className="w-full max-w-3xl">
        <div
          className="prose prose-invert max-w-none text-neutral-100 overflow-auto shadow-lg rounded-xl bg-[#232325] p-6"
          style={{ maxHeight: "80vh" }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{testMd}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Statemindctf25;
