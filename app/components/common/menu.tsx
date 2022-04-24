import { Menu as MantineMenu } from '@mantine/core';
import { gray } from '~/styles/tailwind-colors';

type MenuProps = {
	children: React.ReactNode;
};

function Menu(props: MenuProps) {
	return (
		<MantineMenu
			radius={'md'}
			styles={{
				body: {
					backgroundColor: gray[9],
				},
			}}
		>
			{props.children}
		</MantineMenu>
	);
}

Menu.Label = MantineMenu.Label;
Menu.Item = MantineMenu.Item;

export default Menu;
