/// <reference types="react-scripts" />

declare module 'react-dfp' {
  export type GPTEvent = any;

  export interface DFPEventData {
    slotId: string;
    /* Describe the GPT Event data */
    event: GPTEvent;
  }

  export type Size = [number, number] | string;

  export type SizeMapping = Array<{
    viewport: number[];
    sizes: Size[];
  }>;

  export type AdSenseAttributes = {
    [key: string]: any;
  };

  export type TargetingArguments = {
    [key: string]: any;
  };
  

  type LazyLoad = {
    fetchMarginPercent?: number;
    renderMarginPercent?: number;
    mobileScaling?: number;
  };
}

declare module 'react-dfp/lib/dfpslotsprovider' {
	import { Component, ReactNode } from 'react';
	import { SizeMapping, AdSenseAttributes, TargetingArguments, LazyLoad } from 'react-dfp';
	
	export interface DFPSlotsProviderProps {
		children: ReactNode;
		autoLoad?: boolean;
		autoReload?: {
			dfpNetworkId?: boolean;
			personalizedAds?: boolean;
			singleRequest?: boolean;
			disableInitialLoad?: boolean;
			adUnit?: boolean;
			sizeMapping?: boolean;
			adSenseAttributes?: boolean;
			targetingArguments?: boolean;
			collapseEmptyDivs?: boolean;
			lazyLoad?: boolean;
		};
		dfpNetworkId: string;
		personalizedAds?: boolean;
		singleRequest?: boolean;
		disableInitialLoad?: boolean;
		adUnit?: string;
		sizeMapping?: SizeMapping;
		adSenseAttributes?: AdSenseAttributes;
		targetingArguments?: TargetingArguments;
		collapseEmptyDivs?: boolean;
		lazyLoad?: boolean | LazyLoad;
	}
	
	export default class DFPSlotsProvider extends Component<DFPSlotsProviderProps> {}
}

declare module 'react-dfp/lib/adslot' {
	import { Component } from 'react';
	import { SizeMapping, Size, AdSenseAttributes, TargetingArguments, DFPEventData } from 'react-dfp';
	
	export interface AdSlotProps {
		dfpNetworkId?: string;
		adUnit?: string;
		sizes?: Size[];
		renderOutOfThePage?: boolean;
		sizeMapping?: SizeMapping[];
		fetchNow?: boolean;
		adSenseAttributes?: AdSenseAttributes;
		targetingArguments?: TargetingArguments;
		onSlotRender?: (dfpEventData: DFPEventData) => void;
		onSlotRegister?: (dfpEventData: DFPEventData) => void;
		onSlotIsViewable?: (dfpEventData: DFPEventData) => void;
		onSlotVisibilityChanged?: (dfpEventData: DFPEventData) => void;
		shouldRefresh?: () => boolean;
		slotId?: string;
		className?: string;
	}
	export default class AdSlot extends Component<AdSlotProps> {}
}

declare module 'react-dfp/lib/manager' {
	import { AdSenseAttributes, TargetingArguments, LazyLoad } from 'react-dfp';
	
	export default class DFPManager {
		getGoogletag: () => Promise<any>;
		
		load: (...slotId: string[]) => void;
		
		static refresh: (...slotId: string[]) => void;
		
		reload: (...slotId: string[]) => void;
		
		configureSingleRequest: (enable?: boolean) => void;
		
		configureLazyLoad: (enable: boolean, config?: LazyLoad) => void;
		
		singleRequestIsEnabled: () => boolean;
		
		configurePersonalizedAds: (enable?: boolean) => void;
		
		setAdSenseAttributes: (adSenseAttributes: AdSenseAttributes) => void;
		
		getAdSenseAttributes: () => {
			[key: string]: any;
		};
		
		setAdSenseAttribute: (name: string, value: string) => void;
		
		getAdSenseAttribute: (name: string) => string;
		
		setTargetingArguments: (targetingArguments: TargetingArguments) => void;
		
		setCollapseEmptyDivs: (enable: boolean | null | undefined) => void;
	}
}
