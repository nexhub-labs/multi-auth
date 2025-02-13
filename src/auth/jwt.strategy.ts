import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

// Custom extractor to get the JWT from an HTTP‑only cookie named 'Authorization'
const cookieExtractor = (req: any): string | null => {
    // console.log(req.cookies);
    if (!req || !req.cookies) {
        return null;
    }

    let token = req.cookies['Authorization'] || null;
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        // console.log('JWT Secret:', process.env.JWT_SECRET); // Debug log to check the secret
        super({
            // Use the custom cookie extractor.
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            // Secret key used to sign and verify the JWT.
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        // Additional validation logic can be added here if needed.
        return { userId: payload.sub, username: payload.username };
    }
}
