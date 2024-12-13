from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import MetaData
from sqlalchemy.sql.elements import ClauseElement
from sshtunnel import SSHTunnelForwarder
import databases
import config

# In case someday the API and the database are in different server
server = SSHTunnelForwarder(
    ('125.229.56.26', 22),
    ssh_username=config.ssh_username,
    ssh_password=config.ssh_password,
    remote_bind_address=('localhost', 3306)
)

server.start()
DATABASE_URL = f"mysql+asyncmy://APIB_GPTCI_admin:{config.db_password}@localhost:{str(server.local_bind_port)}/api_based_gptci"

# DATABASE_URL = f"mysql+asyncmy://APIB_GPTCI_admin:{config.db_password}@localhost:3306/api_based_gptci"

db = databases.Database(DATABASE_URL)

metadata = MetaData()
engine = create_async_engine(DATABASE_URL)


async def execute_stmt_in_tran(stmt_list: list[ClauseElement], ret=False) -> any:
    tran = db.transaction()

    try:
        await tran.start()
        if not ret:
            for stmt in stmt_list:
                await db.execute(stmt)
            await tran.commit()
            return True
        else:
            result = None
            for stmt in stmt_list:
                result = await db.execute(stmt)
            await tran.commit()
            return result

    except:
        await tran.rollback()
        return
