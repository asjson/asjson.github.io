function encrypt(data, publicKey, keyId) {
    let nonce = Str.uuid();
    let aesKey = CryptoAes.createKey();
    let encryptedAesKey = CryptoRsa.encrypt(aesKey, publicKey);
    let encryptedData = CryptoAes.encrypt(nonce + '.' + data, aesKey);
    return encryptedData + '.' + encryptedAesKey + '.' + keyId;
}


var Str = /** @class */ (function () {
	function Str() {
	}

    Str.chunkSplit = function(string, length) {
        const size = Math.ceil(string.length / length);
        const r = new Array(size);
        let offset = 0;
        for (let i = 0; i < size; i++) {
            r[i] = string.substr(offset, length);
            offset += length;
        }
        return r
    }

    Str.shuffle = function(string) {
        if (arguments.length === 0) {
            throw new Error('Wrong parameter count for str_shuffle()')
        }

        if (string === null) {
            return ''
        }

        string += '';

        let newString = '';
        let rand;
        let i = string.length;

        while (i) {
            rand = Math.floor(Math.random() * i);
            newString += string.charAt(rand);
            string = string.substring(0, rand) + string.substr(rand + 1);
            i--;
        }

        return newString;
    }

    Str.uuid = function() {
        let uuid = '', i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += "-"
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }

	return Str;
}());


const KEY_SIZE = 32;
const IV_SIZE = 16;
var CryptoAes =/** @class */ (function () {
	function CryptoAes() {
	}

    CryptoAes.createKey = function() {
        let key = '';
        for (let i = 0; i < KEY_SIZE; i++) {
            key += String.fromCharCode(parseInt(Math.random() * (126 - 33 + 1) + 33, 10));
        }
        return key;
    }

     CryptoAes.getRandomIv= function() {
        let allowedIvString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
        if (IV_SIZE > allowedIvString.length) {
            allowedIvString += allowedIvString.repeat(Math.ceil(IV_SIZE / allowedIvString.length));
        }
        return Str.shuffle(allowedIvString).substring(0, IV_SIZE);
    }

    CryptoAes.getKeyHash = function(key) {
        let md = forge.md.sha256.create();
        md.update(key);
        return md.digest().toHex().substring(0, KEY_SIZE);
    }

    CryptoAes.encrypt = function(data, key) {
       let cipher = forge.cipher.createCipher('AES-CBC', CryptoAes.getKeyHash(key));
        cipher.start({iv: CryptoAes.getRandomIv()});
        cipher.update(forge.util.createBuffer(CryptoAes.getRandomIv() + data, 'utf8'));
        cipher.finish();
        return forge.util.encode64(cipher.output.bytes());
    }

	return CryptoAes;
}());

const PADDING_PKCS1_BYTES = 11;

var CryptoRsa =/** @class */ (function () {
	function CryptoRsa() {
	}

    CryptoRsa.preparePublicKey = function(publicKey) {
        if (publicKey.indexOf('-----BEGIN PUBLIC KEY-----') === -1) {
            publicKey = Str.chunkSplit(publicKey.replace("\n", ''), 64).join("\n");
            publicKey = "-----BEGIN PUBLIC KEY-----\n" + publicKey + "-----END PUBLIC KEY-----\n";
        }
        return publicKey;
    }


    CryptoRsa.encrypt = function(data, publicKey) {
        // //使用公钥加密
	    let key = forge.pki.publicKeyFromPem(CryptoRsa.preparePublicKey(publicKey));
        let parts = Str.chunkSplit(forge.util.createBuffer(data, 'utf8').bytes(), key.n.bitLength() / 8 - PADDING_PKCS1_BYTES);
        let encrypted = '';
        parts.forEach(function (part) {
            encrypted += key.encrypt(part);
        });
        return forge.util.encode64(encrypted);
    }

	return CryptoRsa;
}());