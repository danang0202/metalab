import ProgressCard from './card/ProgressCard';
import HiredCard from './card/HiredCard';
import CompletedCard from './card/CompletedCard';
import RejectedCard from './card/RejectedCard';
import CancelledCard from './card/CancelledCard';

const HiringCard = (props) => {
    const item = props.item;
    return (
        <>
            {item.status === 'On Progress' ? (
                <ProgressCard item={item} />
            ) : item.status === 'Hired' ? (
                <HiredCard item={item} />
            ) : item.status === 'Completed' ? (
                <CompletedCard item={item} />
            ) : item.status == "Rejected" ? (
                <RejectedCard item={item} />
            ):(
                <CancelledCard item={item} />
            )}
        </>
    )
}
export default HiringCard