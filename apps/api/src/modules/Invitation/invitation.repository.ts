import Invites from './invitation.model';
import { IInvitationDoc, IResult } from '../../utils/interfaces.util';

class InvitationRepository {
    public async createInvite(
        inviteData: Partial<IInvitationDoc>,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };
        const invited = await Invites.create(inviteData);
        if (!invited) {
            result.error = true;
            result.code = 500;
            result.message = "Couldn't save invite";
            return result;
        }

        result.code = 201;
        result.message = 'Invite created';
        result.data = invited;
        return result;
    }

    public async findInvite(token: string): Promise<IInvitationDoc | null> {
        const invite = await Invites.findOne({ inviteToken: token });
        return invite;
    }

    public async findInviteByEmail(
        email: string,
    ): Promise<IInvitationDoc | null> {
        const invite = await Invites.findOne({ invitee: { email: email } });
        return invite;
    }
}

export default new InvitationRepository();
