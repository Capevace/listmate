// The reason this exists, is that you cannot nest noscript tags in React.
// It leads to some issues with the layout of the page being displayed multiple times.
export default function FauxNoscript({
	children,
}: {
	children?: React.ReactNode;
}) {
	return <span className="without-js">{children}</span>;
}
