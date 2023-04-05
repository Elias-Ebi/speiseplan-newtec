import { Injectable } from "@angular/core";
//import { BinaryToTextEncoding, createHash, timingSafeEqual } from "crypto";

@Injectable()
export class HashService {
    /*
    private encryptionStandard: string[] = ["sha128", "sha256", "sha512"];

    public encrypt(data: string, encryptionStandardIndex: number, encryptionBase: BinaryToTextEncoding): string {
        return createHash(this.encryptionStandard[encryptionStandardIndex]).update(data).digest(encryptionBase);
    }

    public encryptSha128(data: string): string {
        return this.encrypt(data, 0, "hex");
    }

    public encryptSha256(data: string): string {
        return this.encrypt(data, 1, "hex");
    }

    public encryptSha512(data: string): string {
        return this.encrypt(data, 2, "hex");
    }

    public timeSafeEqual(data1: string, data2: string): boolean {
        console.log(data1 + ", " + data2);
        return timingSafeEqual(Buffer.from(data1), Buffer.from(data2));
    }
    */
}
