export type Direction = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
	direction?: Direction;
	children: React.ReactElement | string;
}

const Tooltip: React.FC<TooltipProps> = (props) => {
	const { children, direction = 'top' } = props;

	return <>{children}</>
};

export default Tooltip;
