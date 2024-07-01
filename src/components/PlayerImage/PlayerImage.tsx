import React from 'react'
import Avatar, { IAvatarProps } from '../Avatar'

interface IProps extends Omit<IAvatarProps, 'alt' | 'fill'> {
	name: string
}

export function PlayerImage({ url, name, variant, className, disableMargin, square = false }: IProps) {
	return (
		<Avatar
			url={url}
			alt={name}
			variant={variant}
			className={className}
			disableMargin={disableMargin}
			square={square}
		/>
	);
}

export default PlayerImage;
