import { Link } from "react-router-dom";

const SelectMatch = () => {
  return (
    <div>
      <div className="min-h-screen mx-auto max-w-screen-lg flex flex-col justify-center items-center -mt-20">
        <p className="text-center text-9xl mb-10">404</p>
        <p className="text-center text-4xl mb-10">Not Found!</p>
        <Link to="/">
          <button className="btn">Go Back!</button>
        </Link>
      </div>
    </div>
  );
};

export default SelectMatch;
