import PageNotImg from "../../../assets/pagenot.jpg";
const PageNot = () => {
  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <img
        src={PageNotImg}
        alt="Page Not Found"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="relative flex items-center justify-center h-full w-full z-10 bg-black/60">
        <h1 className="text-white text-3xl md:text-5xl font-bold text-center px-4">
          Page Not Found
        </h1>
      </div>
    </div>
  );
};

export default PageNot;
