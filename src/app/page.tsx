import {Spotlight} from "@/components/ui/Spotlight";

export default function Home() {
  return (
    <>
      <header className="absolute left-0 right-0 min-h-[64px] h-[8rem] max-h-[124px] bg-red-500">
        Header
      </header>
      <main className="h-screen">
        <div
          className="h-full w-full flex md:items-center md:justify-center bg-white dark:bg-black/[0.96] antialiased relative overflow-hidden">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="currentcolor"
          />
          <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
            <h1
              className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-neutral-600 bg-opacity-100">
              Spotlight <br/> is the new trend.
            </h1>
            <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
              Spotlight effect is a great way to draw attention to a specific part
              of the page. Here, we are drawing the attention towards the text
              section of the page. I don&apos;t know why but I&apos;m running out of
              copy.
            </p>
          </div>
        </div>
      </main>
      <footer></footer>
    </>
  );
}
