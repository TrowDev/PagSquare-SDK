

function trataRetornoErro(err: any) {
    if(err?.response) {
        let retorno = `[${err.response?.status}] ${err.response?.statusText}: `
        const data = err?.response?.data;
        if(data?.message) {
            retorno += `'${data.message}'`;
        } else if(data?.detail) {
            retorno += `'${data.detail}'`;
        } else {
            retorno = data;
        }
        return data;
    }
    if(err?.message) {
        return err.message;
    }
    return err?.code;
}

export {
    trataRetornoErro
};
