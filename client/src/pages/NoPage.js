import { Link } from 'react-router-dom';

const NoPage = () => {
  return (
    <>
      <div>Invalid Page</div>
      <Link to='/'>Click here to return to the Lobby</Link>
    </>
  );
}

export default NoPage;