import React, {useMemo} from 'react'
import { makeStyles } from 'tss-react/mui';
import MUIAvatar from '@mui/material/Avatar';
import {asset, getSize, Variant} from '../../utils/asset'

const useStyles = makeStyles()((theme) =>
	({
		containerFill: {
			position: 'relative'
		},
		mr1: {
			marginRight: theme.spacing(1)
		}
	}));

export interface IAvatarProps {
	url?: string,
	alt: string,
	variant?: Variant,
	className?: string,
	disableMargin?: boolean
	square?: boolean
}

export function Avatar({ url, alt, variant, className, disableMargin, square = true }: IAvatarProps) {
	const { classes, cx } = useStyles();
	const srcSet = url ? asset(url, variant) : undefined;
	const size = useMemo(() => getSize(variant), [variant])
	
	return (
		<MUIAvatar
			src={srcSet}
			alt={alt}
			className={cx(!disableMargin && classes.mr1, className)}
			variant={square ? 'square' : 'circular'}
			style={size}
			imgProps={size}
		/>
	);
}

export default Avatar;
