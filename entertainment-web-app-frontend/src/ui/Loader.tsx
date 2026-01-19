function Loader() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col items-center gap-[0.75rem] relative">
        <div className="w-[7.5rem] h-[7.5rem] absolute bottom-[5%] border-[9px] border-solid border-white rounded-[50%] border-t-blue-50 dark:border-t-accent animate-spin-custom"></div>
      </div>
    </div>
  );
}

export default Loader;
