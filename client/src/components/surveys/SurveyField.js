import React from 'react';

export default ({ input, label, meta: { error, touched } }) => {
    return (
        <div>
            <label>{label}</label>
            <input {...input} style={{ marginBottom: '5px' }} autoComplete="off" />
            {/* same as <input onBlur={input.onBlur} onChange={input.onChange} ... and ALL input props/>*/}
            <div className="red-text" style={{ marginBottom: '20px' }}>
                {touched && error /*if true error will be returned */}
            </div>
        </div>
    );
};
