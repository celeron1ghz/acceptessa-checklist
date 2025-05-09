import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Loading() {
  return <div className='text-center text-info' style={{ fontSize: '300%' }}>
    <FontAwesomeIcon icon={faCircleNotch} className='spinner' spin /> Loading...
  </div>;
}