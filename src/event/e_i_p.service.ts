import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InviteEntity } from "./entity/e_i_p_entity";
import { E_I_P_Repo } from "./Repo/e_i_p_repo";
import { E_I_P_Response } from "./models/e_i_p_response";
import { E_I_P_Details } from "./models/e_i_p_details";


@Injectable()
export class E_I_P_Service
{
    [x: string]: any;
    constructor(
        private readonly e_i_p_repo:E_I_P_Repo
    ){} 

    async getInvites(): Promise<E_I_P_Response> {
      try {
          const data = await this.e_i_p_repo.find();
          const inviteRes = new E_I_P_Response();
          const detailsMap = new Map<number, E_I_P_Details>();
  
          for (const item of data) {
              let detailsObj = detailsMap.get(item.invite_id);
              if (!detailsObj) {
                  detailsObj = new E_I_P_Details();
                  detailsObj.invite_id = item.invite_id;
                  detailsObj.event_id = item.event_id;
                  detailsObj.people_id = item.people_id; // Directly assign single value
                  detailsObj.invitation_status = item.invitation_status;
                  detailsMap.set(item.invite_id, detailsObj);
              }
              // No need to push into an array
          }
  
          const details = Array.from(detailsMap.values());
          if (details.length > 0) {
              inviteRes.status = true;
              inviteRes.errorCode = 0;
              inviteRes.internalMessage = "Data retrieved successfully";
          } else {
              inviteRes.status = false;
              inviteRes.errorCode = 1;
              inviteRes.internalMessage = "No data found";
          }
  
          inviteRes.data = details;
          return inviteRes;
      } catch (error) {
          console.error("Error fetching data:", error);
          const errorResponse = new E_I_P_Response();
          errorResponse.status = false;
          errorResponse.errorCode = 1;
          errorResponse.internalMessage = "Error fetching data";
          errorResponse.data = [];
          return errorResponse;
      }
  }
  
  
    
      async saveInvite(details: E_I_P_Details): Promise<E_I_P_Response> {
        const inviteRes = new E_I_P_Response();
        const savedData = [];
    
        try {
            console.log("Details received:", details);
    
            // Assume details.people_id is a single number, not an array
            const people_id = details.people_id;
    
            // Create a new InviteEntity object and set its properties
            const newInvite = new InviteEntity();
            newInvite.invite_id = details.invite_id; 
            newInvite.event_id = details.event_id;
            newInvite.people_id = people_id; 
            newInvite.invitation_status = details.invitation_status;
    
            console.log("Saving invite for people_id:", people_id);
            const savedRecord = await this.e_i_p_repo.save(newInvite);
            console.log("Saved record:", savedRecord);
            savedData.push(savedRecord);
    
            if (savedData.length > 0) {
                inviteRes.status = true;
                inviteRes.errorCode = 0;
                inviteRes.internalMessage = "Invite saved successfully";
                inviteRes.data = savedData;
            } else {
                inviteRes.status = false;
                inviteRes.errorCode = 1;
                inviteRes.internalMessage = "Invite not saved";
                inviteRes.data = [];
            }
        } catch (error) {
            console.error("Error saving invite:", error);
            inviteRes.status = false;
            inviteRes.errorCode = 1;
            inviteRes.internalMessage = "Error saving invite";
            inviteRes.data = [];
        }
    
        return inviteRes;
    }
    
    
    
    async updateInvite(id: number, details: E_I_P_Details): Promise<E_I_P_Response> {
      const inviteRes = new E_I_P_Response();
  
      try { 
          // Delete the existing invite records for the given invite_id
          await this.e_i_p_repo.delete({ invite_id: id });
  
          // Assuming details.people_id is a single number, not an array
          const people_id = details.people_id;
  
          // Create a new InviteEntity object and set its properties
          const newInvite = new InviteEntity();
          newInvite.invite_id = id;
          newInvite.event_id = details.event_id;
          newInvite.people_id = people_id;
          newInvite.invitation_status = details.invitation_status;
  
          // Save the updated InviteEntity object
          const savedRecord = await this.e_i_p_repo.save(newInvite);
  
          if (savedRecord) {
              inviteRes.status = true;
              inviteRes.errorCode = 0;
              inviteRes.internalMessage = "Invite updated successfully";
              inviteRes.data = [savedRecord];
          } else {
              inviteRes.status = false;
              inviteRes.errorCode = 1;
              inviteRes.internalMessage = "Invite not updated";
              inviteRes.data = [];
          }
      } catch (error) {
          console.error("Error updating invite:", error);
          inviteRes.status = false;
          inviteRes.errorCode = 1;
          inviteRes.internalMessage = "Error updating invite";
          inviteRes.data = [];
      }
  
      return inviteRes;
  }
  
    
    async deleteInviteById(inviteId: number): Promise<E_I_P_Response> {
    console.log("Deleting invite with ID:", inviteId);

    const inviteRes = new E_I_P_Response();
    
    try {
        // Find the invite to delete by its invite_id
        const inviteToDelete = await this.e_i_p_repo.findOne({ where: { invite_id: inviteId } });

        if (inviteToDelete) {
            // Delete the invite if found
            await this.e_i_p_repo.delete({ invite_id: inviteId });
            
            inviteRes.status = true;
            inviteRes.errorCode = 0;
            inviteRes.internalMessage = "Invite deleted successfully";
            inviteRes.data = [];
        } else {
            inviteRes.status = false;
            inviteRes.errorCode = 1;
            inviteRes.internalMessage = "Invite not found";
            inviteRes.data = [];
        }
    } catch (error) {
        console.error("Error deleting invite:", error);
        
        inviteRes.status = false;
        inviteRes.errorCode = 1;
        inviteRes.internalMessage = "Error deleting invite";
        inviteRes.data = [];
    }

    return inviteRes;
}

    async getInviteById(id: number): Promise<E_I_P_Response> {
  const inviteRes = new E_I_P_Response();

  try {
      const data = await this.e_i_p_repo.find({ where: { invite_id: id } });
      const detailsObj = new E_I_P_Details();

      if (data.length > 0) {
          detailsObj.invite_id = data[0].invite_id;
          detailsObj.event_id = data[0].event_id;
          detailsObj.people_id = data[0].people_id; // Assuming people_id is a single value, not an array
          detailsObj.invitation_status = data[0].invitation_status;

          inviteRes.status = true;
          inviteRes.errorCode = 0;
          inviteRes.internalMessage = "Data fetched successfully.";
          inviteRes.data = [detailsObj];
      } else {
          inviteRes.status = false;
          inviteRes.errorCode = 1;
          inviteRes.internalMessage = "Data not found.";
          inviteRes.data = [];
      }
  } catch (error) {
      console.error("Error fetching data:", error);
      inviteRes.status = false;
      inviteRes.errorCode = 1;
      inviteRes.internalMessage = "Error fetching data.";
      inviteRes.data = [];
  }

  return inviteRes;
}


  async getInviteIds(event_id:number):Promise<number[]>
{
  const invites=await this.e_i_p_repo.find({
    where:{event_id:event_id},
    select:['invite_id']
  });
  return invites.map(invite=>invite.invite_id);
}

   



async deleteInvites(eventId: number, peopleIds: number[]): Promise<E_I_P_Response> {
    try {
      // Fetch the invites to be deleted
      const invitesToDelete = await this.e_i_p_repo
        .createQueryBuilder('invite')
        .select(['invite.invite_id', 'invite.event_id', 'invite.people_id', 'invite.invitation_status'])
        .where('invite.event_id = :eventId', { eventId })
        .andWhere('invite.people_id IN (:...peopleIds)', { peopleIds })
        .getMany();

      if (invitesToDelete.length > 0) {
        // Perform the delete operation
        await this.e_i_p_repo
          .createQueryBuilder()
          .delete()
          .from(InviteEntity)
          .where('event_id = :eventId', { eventId })
          .andWhere('people_id IN (:...peopleIds)', { peopleIds })
          .execute();

        // Construct the response
        const response: E_I_P_Response = {
          status: true,
          errorCode: 0, // Or appropriate error code if needed
          internalMessage: 'Successfully deleted invites.',
          data: invitesToDelete.map(invite => ({
            invite_id: invite.invite_id,
            event_id: invite.event_id,
            people_id: invite.people_id,
            invitation_status: invite.invitation_status,
          })),
        };

        return response;
      } else {
        // No invites found
        const response: E_I_P_Response = {
          status: false,
          errorCode: 1, // Or appropriate error code if needed
          internalMessage: 'No data found to delete invites.',
          data: [], // Empty data on error
        };

        return response;
      }
    } catch (error) {
      // Handle errors and construct an appropriate response
      console.error('Error deleting invites:', error);
      const response: E_I_P_Response = {
        status: false,
        errorCode: 1, // Or appropriate error code if needed
        internalMessage: 'Failed to delete invites.',
        data: [], // Empty data on error
      };

      return response; 
    }
  }




  async deleteInvitesByEventId(eventId: number): Promise<boolean> {
    try {
      console.log(`Attempting to delete invites with event_id: ${eventId}`);

      const result = await this.e_i_p_repo
        .createQueryBuilder()
        .delete()
        .from(InviteEntity)
        .where('event_id = :eventId', { eventId })
        .execute();

      console.log(`Delete result: ${JSON.stringify(result)}`);

      return result.affected > 0; // Indicates success if rows were affected
    } catch (error) {
      console.error('Error deleting invites:', error);
      return false; // Indicates failure
    }
  }
}