type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export interface KnobProps {
    /**
     * ClassName to add to the knob component
     */
    className?: string,
    /**
     * Size of the knob, the computed size will always be a square.
     * This is the knob size only, it doesn't include the track.
     */
    size?: number,
    /**
     * The number of ticks to display around the knob.  
     * This value has no effect if the `trackType` value is `plain`.  
     * 
     * Default to `25`.
     */
    numTicks?: number,
    /**
     * The `degrees` props represent the size of the track around the knob.  
     * Always in a circle perimeter range `[0, 360]`.  
     * 
     * Default to `260`.
     */
    degrees?: Range<0, 360>,
    /**
     * The minimum value to pass to the knob.  
     * Can be negative.
     * 
     * Default to `1`.
     */
    min?: number,
    /**
     * The maximum value to pass to the knob.  
     * Can be negative.
     * 
     * Default to `100`.
     */
    max?: number,
    /**
     * The default value to pass to the knob.
     * The knob will point this value on load.  
     * This value has to be between the `min` and `max` range. Otherwise it has no effect.
     * 
     * Default to `0`.
     */
    defaultValue?: number,
    /**
     * Any functions to execute when turning the knob can be pass to this property.  
     * The `value` param returns the current value between the `min` and `max` props.
     * @param value The current value between the `min` and `max` props.
     */
    onWheel?: (value: number) => void,
    /**
     * Define if the knob should always have at least one tick active.
     * 
     * Default to `false`.
     */
    firstActive?: boolean,
    /**
     * The track type look.
     * - `plain` will render a plain track, the `numTicks` prop has no effect.
     * - `notch` will render the amout of ticks specified with the `numTicks` prop.
     */
    trackType?: 'plain' | 'notch',
    /**
     * Define the track active color.
     */
    trackColor?: string,
    /**
     * Define the track inactive color.
     */
    trackBackground?: string,
    /**
     * Define the marker look.
     * Can be `led`, `neon`, `dot`, `line` or `custom`.  
     * When set to `custom` every style properties as background is removed. You can pass them through the `markerStyle` prop.
     */
    markerType?: 'led' | 'neon' | 'dot' | 'line' | 'custom',
    /**
     * Style to pass to the marker.
     */
    markerStyle?: React.CSSProperties,
    /**
     * If set to `true`, provide a circle between the knob and the track.
     */
    outcircle?: boolean,
    /**
     * The size of the out circle
     */
    outcircleSize?: string
}

export interface TickProps {
    deg: number;
    tickStyle: TickStyleProps
}

export interface TickStyleProps extends React.CSSProperties {
    width: number | string,
    height: number | string;
    left: number | string;
    top: number | string;
    transform: string;
    transformOrigin: string;
    boxShadow: string
}