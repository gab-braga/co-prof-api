import 'dotenv/config';
import { createUser } from './firebase/auth';

(async () => {
  const user = await createUser({
    name: 'Gabriel',
    email: 'gabriel@email.com',
    password: '123456',
  });
  console.log(user);
})();
