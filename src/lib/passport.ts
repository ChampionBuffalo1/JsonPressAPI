import passport from 'passport';
import { JwtSecret } from '../Constants';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { UserType } from '../typings/model';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JwtSecret
};

export type JwtPayload = {
  id: string;
  role?: UserType['role'];
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload: JwtPayload, done) => {
    try {
      if (!jwt_payload.id) return done(null, false);
      return done(null, jwt_payload);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
