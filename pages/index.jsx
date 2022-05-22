import dynamic from 'next/dynamic'
const MyAwesomeMap = dynamic(() => import("../components/map"), { ssr:false })

const index = () => {
  return (
    <main>
      <h1>test</h1>
      <MyAwesomeMap />
    </main>
  );
};

export default index;
