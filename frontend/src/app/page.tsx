import { redirect } from "next/navigation";

const Home = () => {
  return redirect("/orders");
};

export default Home;
