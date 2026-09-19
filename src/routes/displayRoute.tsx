import LiveDisplay from "@/pages/display/LiveDisplay";

const displayRoute = {
  path: "/display",
  children: [
    { path: "live", element: <LiveDisplay /> },
  ],
};

export default displayRoute;
