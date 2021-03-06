import styled from 'styled-components';

const CirclePositionElement = styled.div`
    @keyframes pointerBlink {
    	0% {
    		opacity: 0.9;
    		transform: scale(1.8, 1.8);
    		border-radius: 50%;
    	}
    	99% {
    		border-radius: 0;
    	}
    	100% {
    		opacity: 0.5;
    		transform: scale(0.9, 0.9);
    		border-radius: 50%;
    	}
    }

		animation-name: ${props => props.blink ? 'pointerBlink' : ''};
		animation-duration: 1s;
		animation-iteration-count: infinite;

    background-color: ${props => props.bgColor};
    position: absolute;
    width: ${props => props.width || 5}px;
    height: ${props => props.height || 5}px;
    top: ${props => props.top};
    left: ${props => props.left};
    cursor: pointer;
`;

export default CirclePositionElement;