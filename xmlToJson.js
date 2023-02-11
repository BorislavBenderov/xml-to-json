var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var fs = require("fs");
var https = require("https");
var xml2js = require("xml2js");
// Function to download image files
var downloadImage = function (url, localPath) {
    https.get(url, function (response) {
        response.pipe(fs.createWriteStream(localPath));
    });
};
// Function to parse XML to JSON
var parseXML = function (xml, uniqueID) {
    return new Promise(function (resolve, reject) {
        xml2js.parseString(xml, function (err, result) {
            if (err)
                reject(err);
            var properties = result.root.row;
            var filteredProperties = properties.map(function (property) { return property.Realty; });
            var property = filteredProperties.filter(function (prop) { return prop[0].UniqueId[0] == uniqueID; });
            if (!property)
                reject("No property found with uniqueID: ".concat(uniqueID));
            property[0][0].listingType =
                property[0][0].OfferType[0] === "For Sale" ? 1 : 2;
            property[0][0].Pictures[0].Image.forEach(function (image, index) {
                var url = image;
                var localPath = "./images/property-".concat(uniqueID, "-").concat(index, ".jpg");
                downloadImage(url, localPath);
                image.localPath = localPath;
            });
            resolve(property);
        });
    });
};
// Main function to run the script
var main = function (uniqueID) { return __awaiter(_this, void 0, void 0, function () {
    var xmlUrl, xml;
    var _this = this;
    return __generator(this, function (_a) {
        if (!uniqueID) {
            console.error("Please provide a uniqueID as a command-line argument.");
            process.exit(1);
        }
        xmlUrl = "https://firebasestorage.googleapis.com/v0/b/codebooth-a4b70.appspot.com/o/interview_test_case%2Ftest_.xml?alt=media&token=9bca2d06-88d7-4aad-8763-374e81b3ebaf";
        xml = "";
        https.get(xmlUrl, function (response) {
            response.on("data", function (chunk) {
                xml += chunk;
            });
            response.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                var property, outputPath, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, parseXML(xml, uniqueID)];
                        case 1:
                            property = _a.sent();
                            outputPath = "./property-".concat(uniqueID, ".json");
                            fs.writeFileSync(outputPath, JSON.stringify(property, null, 2));
                            console.log("Output written to file: ".concat(outputPath));
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            console.error(err_1);
                            process.exit(1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        });
        return [2 /*return*/];
    });
}); };
// Get the uniqueID from the command-line argument
var uniqueID = process.argv[2];
main(uniqueID);
