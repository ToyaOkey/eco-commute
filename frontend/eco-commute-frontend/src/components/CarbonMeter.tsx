import { motion } from 'framer-motion';

const CarbonMeter = ({ percentage }: { percentage: number }) => (
    <div className="mt-6 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Your Carbon Emissions</h3>
        <div className="w-full max-w-md mx-auto h-6 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1 }}
            />
        </div>
        <p className="text-sm mt-2 text-gray-600">
            {percentage}% of average commute emissions
        </p>
    </div>
);

export default CarbonMeter;