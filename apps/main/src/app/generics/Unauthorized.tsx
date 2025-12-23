import { useLocation } from "react-router-dom";

const UnAAuthorized = () => {
  const location = useLocation();

    return (
      <>
        <div>
          <h2>Error 401: {location.state?.message}</h2>
        </div>
      </>
    );
  };
  
  export default UnAAuthorized;
  