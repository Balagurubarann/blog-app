import { Footer } from "flowbite-react";
import React from "react";
import { Link } from 'react-router-dom'

export default function FooterComponent() {
  return (
    <Footer container className="border border-t-8 border-zinc-700">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between">
          <div className="">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white flex gap-2 items-center"
            >
              <span className="bg-black rounded p-2 text-white dark:bg-white dark:text-black">
                BLOG
              </span>
              SPOT
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <Footer.Title title="About">
              <Footer.LinkGroup col>
              <div>
                  <Footer.Link
                  href="https://github.com/balagurubarann/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                    Balagurubaran
                  </Footer.Link>
                </div>
                <div>
                  <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                    Blog
                  </Footer.Link>
                </div>
              </Footer.LinkGroup>
            </Footer.Title>
          </div>  
        </div>
      </div>
    </Footer>
  );
}
