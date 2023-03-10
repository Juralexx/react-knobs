import React from 'react'
import { KnobProps, TickProps, TickStyleProps } from './type';

const defaultProps: KnobProps = {
    size: 100,
    numTicks: 25,
    degrees: 260,
    min: 1,
    max: 100,
    defaultValue: 0,
    onWheel: () => { },
    firstActive: false,
    trackType: 'notch',
    trackColor: '#509eec',
    trackBackground: 'black',
    markerType: 'led',
    outcircle: true,
    outcircleSize: '8px'
}

const Knob = (props: KnobProps) => {
    let {
        size,
        numTicks,
        degrees,
        min,
        max,
        defaultValue,
        onWheel,
        firstActive,
        trackType,
        trackColor,
        trackBackground,
        markerType,
        outcircle,
        outcircleSize
    } = { ...defaultProps, ...props } as KnobProps

    let fullAngle: number = degrees;
    let startAngle: number = (360 - degrees) / 2;
    let endAngle: number = startAngle + degrees;
    let margin: number = size * 0.12;

    const [currentDeg, setCurrentDeg] = React.useState<number>(startAngle)
    const [active, setActive] = React.useState<boolean>(false)

    if (trackType === 'plain') {
        numTicks = degrees
    }

    const renderTicks = () => {
        let ticks: TickProps[] = [];
        const incr: number = fullAngle / numTicks;
        const tickSize: number = margin + size / 2;
        for (let deg = startAngle; deg <= endAngle; deg += incr) {
            const tick: TickProps = {
                deg: deg,
                tickStyle: {
                    width: trackType === 'plain' ? size * 0.013 : 3,
                    height: tickSize + 10,
                    left: tickSize - 1,
                    top: tickSize,
                    transform: `rotate(${deg}deg)`,
                    transformOrigin: "top",
                    background: trackBackground,
                    boxShadow: firstActive && deg === startAngle ? `inset 0 0 5px 2px ${trackColor}, 0 0 0 1px ${trackColor}` : 'unset'
                } as TickStyleProps
            };
            ticks.push(tick);
        }
        return ticks;
    };

    const getDeg = (props: any) => {
        const { cX, cY, pts } = props
        const x: number = cX - pts.x;
        const y: number = cY - pts.y;
        let deg: number = Math.atan(y / x) * 180 / Math.PI;
        if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
            deg += 90;
        } else {
            deg += 270;
        }
        let finalDeg: number = Math.min(Math.max(startAngle, deg), endAngle);
        return finalDeg;
    };

    const getValue = (currentDegree: number) => {
        let step: number = degrees / (max - min)
        let currentDegFromZero: number = currentDegree - startAngle
        const tickVal: number = currentDegFromZero / step
        if (tickVal < min) {
            return min
        } else {
            if (min < 0) {
                return Math.floor(tickVal - Math.abs(min))
            } else return Math.floor(tickVal)
        }
    }

    const startDrag = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (!active) {
            setActive(true)
        }
        const knob = e.target as HTMLElement
        const { left, top, width, height }: DOMRect = knob.getBoundingClientRect()
        const pts: Record<string, number> = {
            x: left + width / 2,
            y: top + height / 2
        }

        const moveHandler = (e: any) => {
            const deg: number = getDeg({ cX: e.clientX, cY: e.clientY, pts })
            setCurrentDeg(getDeg({ cX: e.clientX, cY: e.clientY, pts }))
            if (currentDeg === startAngle) {
                setCurrentDeg(prev => prev - 1)
            }
            return onWheel(getValue(deg))
        }

        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", moveHandler);
        });
    };

    const convertRange = (props: Record<string, number>) => {
        const { oldMin, oldMax, newMin, newMax, oldValue } = props
        return (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
    }

    React.useEffect(() => {
        if (defaultValue >= min && defaultValue <= max) {
            let startDegrees = Math.floor(convertRange({ oldMin: min, oldMax: max, newMin: startAngle, newMax: endAngle, oldValue: defaultValue }))
            setCurrentDeg(startDegrees)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue])

    /**
     * 
     */

    const dcpy = (styles: React.CSSProperties) => {
        return JSON.parse(JSON.stringify(styles))
    }

    let iStyle: React.CSSProperties = dcpy({
        width: size,
        height: size,
        transform: `rotate(${currentDeg}deg)`
    });
    let oStyle: React.CSSProperties = dcpy({
        width: size,
        height: size,
        margin: margin,
        boxShadow: outcircle ? `0 5px 15px 2px black, 0 0 5px 3px black, 0 0 0 ${outcircleSize} #444` : '0 5px 15px 2px black, 0 0 5px 3px black, 0 0 0 9px #1c1c1c'
    });

    return (
        <div
            className={props.className ? (active ? `knob ${props.className} active` : `knob ${props.className}`) : (active ? "knob active" : 'knob')}
            onClick={() => () => setActive(true)}
            onMouseLeave={() => setActive(false)}
        >
            <div className="ticks">
                {numTicks &&
                    renderTicks().map((tick, i) => (
                        <div
                            key={i}
                            className={`tick ${trackType}` + (tick.deg <= currentDeg ? " active" : "")}
                            style={{
                                ...tick.tickStyle,
                                background: tick.deg <= currentDeg ? 'none' : trackBackground,
                                boxShadow: trackType === 'notch' ? (
                                    tick.deg <= currentDeg ? `inset 0 0 5px 2px ${trackColor}, 0 0 0 1px ${trackColor}` : `inset 0 0 0 0 ${trackBackground}`
                                ) : (
                                    tick.deg <= currentDeg ? `inset 0 0 5px 5px ${trackColor}, 0 0 0 0px ${trackColor}` : `inset 0 0 0 0 ${trackBackground}`
                                )
                            }}
                        />
                    ))}
            </div>
            <div className="knob outer" style={oStyle} onMouseDown={startDrag}>
                <div className="knob inner" style={iStyle}>
                    <div className={`marker ${markerType}`} style={props?.markerStyle} />
                </div>
            </div>
        </div>
    );
}

export default Knob