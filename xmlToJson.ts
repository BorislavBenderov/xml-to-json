const fs = require("fs");
const https = require("https");
const xml2js = require("xml2js");

// Function to download image files
const downloadImage = (url: string, localPath: string) => {
  https.get(url, (response) => {
    response.pipe(fs.createWriteStream(localPath));
  });
};

// Function to parse XML to JSON
const parseXML = (xml: string, uniqueID: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      if (err) reject(err);

      const properties = result.root.row;
      const filteredProperties = properties.map((property) => property.Realty);
      const property = filteredProperties.filter(
        (prop) => prop[0].UniqueId[0] == uniqueID
      );

      if (!property) reject(`No property found with uniqueID: ${uniqueID}`);
      property[0][0].listingType =
        property[0][0].OfferType[0] === "For Sale" ? 1 : 2;
      property[0][0].Pictures[0].Image.forEach((image: any, index: number) => {
        const url = image;

        const localPath = `./images/property-${uniqueID}-${index}.jpg`;
        downloadImage(url, localPath);
        image.localPath = localPath;
      });
      resolve(property);
    });
  });
};

// Main function to run the script
const main = async (uniqueID: string) => {
  if (!uniqueID) {
    console.error("Please provide a uniqueID as a command-line argument.");
    process.exit(1);
  }

  const xmlUrl =
    "https://firebasestorage.googleapis.com/v0/b/codebooth-a4b70.appspot.com/o/interview_test_case%2Ftest_.xml?alt=media&token=9bca2d06-88d7-4aad-8763-374e81b3ebaf";

  let xml = "";
  https.get(xmlUrl, (response) => {
    response.on("data", (chunk) => {
      xml += chunk;
    });
    response.on("end", async () => {
      try {
        const property = await parseXML(xml, uniqueID);
        const outputPath = `./property-${uniqueID}.json`;
        fs.writeFileSync(outputPath, JSON.stringify(property, null, 2));
        console.log(`Output written to file: ${outputPath}`);
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });
};

// Get the uniqueID from the command-line argument
const uniqueID = process.argv[2];
main(uniqueID);
