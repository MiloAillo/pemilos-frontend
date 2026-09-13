import MainLayout from "@/layouts/MainLayout";
import getCandidateLoader from "@/loader/getCandidate";
import userAuthLoader from "@/loader/userAuth";
import Form from "@/pages/form/Form";
import Home from "@/pages/Home";

export { detailsMap } from "@/data/candidate";

const userRoute = {
  path: "/",
  element: <MainLayout />,
  loader: userAuthLoader,
  children: [
    { index: true, element: <Home />, },
    { path: "form", element: <Form />, loader: getCandidateLoader },
  ],
};

export default userRoute;
