import React from 'react';

export default ({ input, label }) => {
    return (
        <div>
            <label>{label}</label>
            <input {...input} />
            {/* same as <input onBlur={input.onBlur} onChange={input.onChange} ... and ALL input props/>*/}
        </div>
    );
};
