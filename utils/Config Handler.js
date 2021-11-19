module.exports.getConfig = () => {
    try {
        let fileContents = fs.readFileSync('./config.yml', 'utf8');
        return yaml.load(fileContents);
    }
    catch (e) {
        console.log(e);
    }
}