import mongoose from 'mongoose';
import User from '../../models/User.js';
import testConfig from '../../config/test.js';

beforeAll(async () => {
    await mongoose.connect(testConfig.database.url);
});

afterAll(async () => {
    await mongoose.disconnect();
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe('User Model Test', () => {
    it('should create & save user successfully', async () => {
        const validUser = new User({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });
        const savedUser = await validUser.save();
        
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(validUser.name);
        expect(savedUser.email).toBe(validUser.email);
        expect(savedUser.password).not.toBe('123456'); // senha deve estar hasheada
    });

    it('should fail to save user without required fields', async () => {
        const userWithoutRequiredField = new User({ name: 'John Doe' });
        let err;
        
        try {
            await userWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should fail to save user with invalid email', async () => {
        const userWithInvalidEmail = new User({
            name: 'John Doe',
            email: 'invalid-email',
            password: '123456'
        });
        
        await expect(userWithInvalidEmail.save()).rejects.toThrow();
    });

    it('should compare password correctly', async () => {
        const user = new User({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });
        await user.save();
        
        const isMatch = await user.comparePassword('123456');
        const isNotMatch = await user.comparePassword('wrong-password');
        
        expect(isMatch).toBe(true);
        expect(isNotMatch).toBe(false);
    });
});
