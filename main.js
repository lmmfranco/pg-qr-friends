const vm = new Vue({
    el: "#app",
    data() {
        return {
            message: "",
            contacts: [],
        }
    },
    created() {
        this.message = "Loading...";

        const params = new URLSearchParams(location.search)

        if(params.has("from")) {
            const pad = params.get("from");
            const padLink = `<a href="http://dontpad.com/${pad}">http://dontpad.com/${pad}</a>`;

            this.message = `Loading data from ${padLink}`;

            axios.get(`https://cors-anywhere.herokuapp.com/dontpad.com/${pad}.body.json?lastUpdate=0`)
            .then(res => {
                const data = res.data.body || "";
                
                if(data.trim().length > 0) {
                    const lines = data.trim().replace("\\n", "\n").split("\n");
                    this.message = `Found ${lines.length} contacts in ${padLink}`;

                    lines.forEach((line, index) => {
                        const code = /((?:\d\s?){12})$/.exec(line);
                        const contact = {
                            id: index,
                            desc: line,
                            codeElem: 'qrcode'+index,
                            codeData: code ? code[0].trim().replace(/\s/g, "") : null
                        }

                        this.contacts.push(contact);

                        if(contact.codeData) {
                            setTimeout(() => { new QRCode(contact.codeElem, contact.codeData); });
                        }
                    });
                } else {
                    this.message = `No contacts found in ${padLink}`
                }
            })
            .catch(err => {
                this.message = `Failed to load ${padLink}`;
                console.log(err);
            })
        } else {
            this.message = `Parameter "from" missing in URL.`
        }
    }
})