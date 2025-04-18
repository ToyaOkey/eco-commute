import {useState} from "react";

const AIExplanation = () => {
    const [show, setShow] = useState(false);
    return (
        <div className="mt-6 text-center">
            <button
                className="text-sm underline text-blue-600 hover:text-blue-800"
                onClick={() => setShow(!show)}
            >
                {show ? 'Hide Explanation' : 'Why this route?'}
            </button>
            {show && (
                <p className="text-sm text-gray-700 mt-2 max-w-md mx-auto">
                    This route avoids high-traffic zones and prioritizes hybrid public transport, reducing emissions by 62% and saving you $3 daily.
                </p>
            )}
        </div>
    );
};


export default AIExplanation;