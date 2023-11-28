import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Beranda from "../assets/components/talent/Beranda.jsx";
import HiredCard from "../assets/components/talent/card/HiredCard.jsx";
import DetailHiringIcon from "../assets/components/talent/small/DetailHiringIcon.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Beranda">
                <Beranda/>
            </ComponentPreview>
            <ComponentPreview path="/HiredCard">
                <HiredCard/>
            </ComponentPreview>
            <ComponentPreview path="/DetailHiringIcon">
                <DetailHiringIcon/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews