import dynamic from "next/dynamic";

const CoordsMap = dynamic(() => import("../components/MapPerimeter"), {
  ssr: false,
});

const coords = () => {
  return (
    <main>
      <CoordsMap/>
    </main>
  );
};

export default coords;
