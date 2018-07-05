export const AN_ACTION_TYPE = 'AN_ACTION_TYPE';

export const anAction = aPayload => {
    return {
        type: AN_ACTION_TYPE,
        payload: aPayload
    };
};