'use client'
import { Badge } from '@/components/ui/badge'

import { GetCompetitionById } from '@/lib/types'
const WeightClasses = ({
    competition,
}: {
    competition: GetCompetitionById
}) => {
    return (
        <div className='flex flex-col gap-2'>
            {competition.wcMale && (
                <div className='flex gap-4 items-center'>
                    <div className='text-lg font-bold w-24'>Male</div>
                    {competition.wcMale?.split('/').map((item) => (
                        <Badge
                            key={item}
                            className='w-16 flex justify-center items-center'
                        >
                            {item}
                            kg
                        </Badge>
                    ))}
                </div>
            )}
            {competition.wcFemale && (
                <div className='flex gap-4 items-center'>
                    <div className='text-lg font-bold w-24'>Female</div>
                    {competition.wcFemale?.split('/').map((item) => (
                        <Badge
                            key={item}
                            className='w-16 flex justify-center items-center'
                        >
                            {item}
                            kg
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}

export { WeightClasses }
