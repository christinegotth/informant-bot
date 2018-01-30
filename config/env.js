const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');
const S3 = require('aws-sdk/clients/s3');
const request = require('request-promise-native');

const required_env = [
    'FB_PAGETOKEN',
    'FB_VERIFYTOKEN',
    'DF_PROJECTID',
    'CMS_API_URL',
];

const load_s3 = (filename) => {
    const params = {Bucket: 'wdr-tim-bot-env', 
                    Key: 'staging/'+ filename}
    const url = (new S3({region:'eu-central-1'})).getSignedUrl('getObject', params);
    return request({uri:url, json:true});
}

const fetch_env = () => {
    if ('CI' in process.env){
        const myfile = load_s3('env.json').then((response)=>{
            return response;
        });                
        return myfile;
    }
    
    const dotenv_path = path.resolve(__dirname, "../.env.yml");
    const environment = {};
    if(fs.existsSync(dotenv_path)) {
        Object.assign(environment, yaml.safeLoad(fs.readFileSync(dotenv_path, 'utf8')));
    }

    required_env.forEach(key => {
        if(key in process.env) {
            environment[key] = process.env[key];
            return;
        }

        if(!(key in environment)) {
            throw new Error(`Environment Variable "${key}" must be declared.`);
        }
    });

    return environment;
};



module.exports.stage = () => {
    return 'dev'; 
    // process.env.SLS_STAGE || fetch_env()['DEPLOY_ALIAS'] || 'dev';
};
module.exports.env = fetch_env;
